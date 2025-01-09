use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Offer {
    pub id: u64,
    /// 制单人
    pub maker: Pubkey,
    /// 持有的代币
    pub token_mint_a: Pubkey,
    /// 想要的代币
    pub token_mint_b: Pubkey,
    /// 想要的代币数量
    pub token_b_wanted_amount: u64,
    pub bump: u8, 
}
