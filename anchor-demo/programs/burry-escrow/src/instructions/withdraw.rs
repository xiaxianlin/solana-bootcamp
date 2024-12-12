use crate::constants::*;
use crate::error::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use std::str::FromStr;
use switchboard_solana::AggregatorAccountData;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [ESCROW_SEED, user.key().as_ref()],
        bump,
        close = user
    )]
    pub escrow_account: Account<'info, EscrowState>,

    #[account(
        address = Pubkey::from_str(SOL_USDC_FEED).unwrap()
    )]
    pub feed_aggregator: AccountLoader<'info, AggregatorAccountData>,

    pub system_program: Program<'info, System>,
}

pub fn withdraw_handler(ctx: Context<Withdraw>) -> Result<()> {
    let feed = &ctx.accounts.feed_aggregator.load()?;
    let escrow_state = &ctx.accounts.escrow_account;

    if !escrow_state.out_of_jail {
        let val: f64 = feed.get_result()?.try_into()?;

        feed.check_staleness(Clock::get().unwrap().unix_timestamp, 300)
            .map_err(|_| error!(EscrowErrorCode::StaleFeed))?;

        msg!("Current feed result is {}!", val);
        msg!("Unlock price is {}", escrow_state.unlock_price);

        if val < escrow_state.unlock_price as f64 {
            return Err(EscrowErrorCode::SolPriceBelowUnlockPrice.into());
        }
    }

    // let current_sol_price: f64 = feed.get_result()?.try_into()?;

    // Check if the feed has been updated in the last 5 minutes (300 seconds)
    // feed.check_staleness(Clock::get().unwrap().unix_timestamp, 300)
    //     .map_err(|_| error!(EscrowErrorCode::StaleFeed))?;

    // msg!("Current SOL price is {}", current_sol_price);
    // msg!("Unlock price is {}", escrow.unlock_price);

    // if current_sol_price < escrow.unlock_price {
    //     return Err(EscrowErrorCode::SolPriceBelowUnlockPrice.into());
    // }

    let escrow_lamports = escrow_state.escrow_amount;

    // Transfer lamports from escrow to user
    **escrow_state.to_account_info().try_borrow_mut_lamports()? = escrow_state
        .to_account_info()
        .lamports()
        .checked_sub(escrow_lamports)
        .ok_or(ProgramError::InsufficientFunds)?;

    **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? = ctx
        .accounts
        .user
        .to_account_info()
        .lamports()
        .checked_add(escrow_lamports)
        .ok_or(ProgramError::InvalidArgument)?;

    Ok(())
}
