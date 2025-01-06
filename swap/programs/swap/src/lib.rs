pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("FHAZHBEeRdSmLUhdZz15D35GataRrXxMY8sbXBEMQq1f");

#[program]
pub mod swap {
    use super::*;

    pub fn make_offer(
        context: Context<MakeOffer>,
        id: u64,
        token_a_offered_amount: u64,
        token_b_wanted_acmount: u64,
    ) -> Result<()> {
        make_offer::send_offered_tokens_to_vault(&context, token_a_offered_amount)?;
        make_offer::save_offer(context, id, token_b_wanted_acmount)
    }
}
