// test.ts
import * as CCIP from '@chainlink/ccip-js'
import { createWalletClient, createPublicClient, custom, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia, avalancheFuji } from 'viem/chains'

function test() {
    const sepoliaRouterAddress = '0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59'
    const fujiRouterAddress = '0xF694E193200268f9a4868e4Aa017A0118C9a8177'
    const usdcTokenAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
    const linkTokenAddress = '0x779877A7B0D9E8603169DdbD7836e478b4624789'
    const sepoliaChainSelector = '16015286601757825753'
    const fujiChainSelector = '14767482510784806043'
    const destinationAccountAddress = '0x31Af3Bf5F946A08c016407a72A748221602C7e39'
    const amountOfUsdc = 100000n // 0.1 USDC

    const ccipClient = CCIP.createClient()

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
    })

    // Convert private key to an account object
    const account = privateKeyToAccount(
        '0x_PRIVATE_KEY'
    )

    const walletClient = createWalletClient({
        chain: sepolia,
        transport: http(),
        account, // Attach the account
    })

    function approveRouter() {
        // Approve Router to transfer tokens on user's behalf
        ccipClient
            .approveRouter({
                client: walletClient as any,
                routerAddress: sepoliaRouterAddress,
                tokenAddress: usdcTokenAddress,
                amount: amountOfUsdc,
                waitForReceipt: true,
            })
            .then(({ txHash, txReceipt }) => {
                console.log(
                    `Transfer approved. Transaction hash: ${txHash}. Transaction receipt: ${txReceipt}`
                )
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getAllowance() {
        ccipClient
            .getAllowance({
                client: walletClient as any,
                account: walletClient.account.address,
                routerAddress: sepoliaRouterAddress,
                tokenAddress: usdcTokenAddress,
            })
            .then((allowance) => {
                console.log(`Allowance for USDC Token: ${allowance}`)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getOnRampAddress() {
        ccipClient
            .getOnRampAddress({
                client: walletClient as any,
                routerAddress: sepoliaRouterAddress,
                destinationChainSelector: fujiChainSelector,
            })
            .then((onRampAddress) => {
                console.log(`On Ramp Address: ${onRampAddress}`)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getSupportedFeeTokens() {
        ccipClient
            .getSupportedFeeTokens({
                client: walletClient as any,
                routerAddress: sepoliaRouterAddress,
                destinationChainSelector: fujiChainSelector,
            })
            .then((supportedFeeTokens) => {
                console.log(`Supported Fee Tokens: ${supportedFeeTokens}`)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getLaneRateRefillLimits() {
        ccipClient
            .getLaneRateRefillLimits({
                client: walletClient as any,
                routerAddress: sepoliaRouterAddress,
                destinationChainSelector: fujiChainSelector,
            })
            .then((currentRateLimiterState) => {
                console.log(
                    `Current Rate Limiter State:\n
                    Number of Tokens: ${currentRateLimiterState.tokens}\n
                    Last Updated: ${currentRateLimiterState.lastUpdated}\n
                    Is Enabled: ${currentRateLimiterState.isEnabled}\n
                    Capacity: ${currentRateLimiterState.capacity}\n
                    Rate: ${currentRateLimiterState.rate}\n
                `
                )
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getTokenRateLimitByLane() {
        ccipClient
            .getTokenRateLimitByLane({
                client: walletClient as any,
                routerAddress: sepoliaRouterAddress,
                supportedTokenAddress: usdcTokenAddress,
                destinationChainSelector: fujiChainSelector,
            })
            .then((transferPoolTokenOutboundLimit) => {
                console.log(
                    `Transfer Pool Token Outbound Limit:\n
                    Number of Tokens: ${transferPoolTokenOutboundLimit.tokens}\n
                    Last Updated: ${transferPoolTokenOutboundLimit.lastUpdated}\n
                    Is Enabled: ${transferPoolTokenOutboundLimit.isEnabled}\n
                    Capacity: ${transferPoolTokenOutboundLimit.capacity}\n
                    Rate: ${transferPoolTokenOutboundLimit.rate}\n
                `
                )
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getFee() {
        ccipClient
            .getFee({
                client: walletClient as any,
                routerAddress: sepoliaRouterAddress,
                tokenAddress: usdcTokenAddress,
                amount: 1000000n,
                destinationChainSelector: fujiChainSelector,
                destinationAccount:
                    '0x31Af3Bf5F946A08c016407a72A748221602C7e39',
                feeTokenAddress: linkTokenAddress,
            })
            .then((fee) => {
                console.log(`Fee: ${fee}`)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getTokenAdminRegistry() {
        ccipClient
            .getTokenAdminRegistry({
                client: walletClient as any,
                routerAddress: sepoliaRouterAddress,
                tokenAddress: usdcTokenAddress,
                destinationChainSelector: fujiChainSelector,
            })
            .then((tokenAdminRegistry) => {
                console.log(
                    `Token Admin Registry Address: ${tokenAdminRegistry}`
                )
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function isTokenSupported() {
        ccipClient
            .isTokenSupported({
                client: walletClient as any,
                routerAddress: sepoliaRouterAddress,
                tokenAddress: usdcTokenAddress,
                destinationChainSelector: fujiChainSelector,
            })
            .then((isTokenSupported) => {
                console.log(`Is Token Supported: ${isTokenSupported}`)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function transferTokensPayLINK() {
        approveRouter() // First approve Router to transfer tokens on user's behalf
        ccipClient
            .transferTokens({
                client: walletClient as any,
                routerAddress: sepoliaRouterAddress,
                tokenAddress: usdcTokenAddress,
                destinationChainSelector: fujiChainSelector,
                destinationAccount: destinationAccountAddress,
                amount: amountOfUsdc,
                feeTokenAddress: linkTokenAddress,
            })
            .then(({ txHash, txReceipt, messageId }) => {
                console.log(
                    `Transfer successful. Transaction hash: ${txHash}. Transaction receipt: ${txReceipt}. Message ID: ${messageId}`
                )
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function transferTokensPayNative() {
        approveRouter() // First approve Router to transfer tokens on user's behalf
        ccipClient
            .transferTokens({
                client: walletClient as any,
                routerAddress: sepoliaRouterAddress,
                tokenAddress: usdcTokenAddress,
                destinationChainSelector: fujiChainSelector,
                destinationAccount: destinationAccountAddress,
                amount: amountOfUsdc,
            })
            .then(({ txHash, txReceipt, messageId }) => {
                console.log(
                    `Transfer successful. Transaction hash: ${txHash}. Transaction receipt: ${txReceipt}. Message ID: ${messageId}`
                )
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getTransferStatus() {
        ccipClient
            .getTransferStatus({
                client: walletClient as any,
                sourceChainSelector: fujiChainSelector,
                destinationRouterAddress: sepoliaRouterAddress,
                messageId:
                    '0x025bdeee30874e00e8e50c50f6f43341effebce66f1bbf9878f6eaca44a45330',
                fromBlockNumber: 7926395n, // Should be within 10000 block range (i.e., latestBlock - fromBlockNumber < 10000), because ranges over 10000 blocks are not supported by the free-tier of viem
            })
            .then((transferStatus) => {
                console.log(
                    `Transfer Status: ${CCIP.TransferStatus[transferStatus] || 'Unknown Status'
                    }`
                )
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getTransactionReceipt() {
        ccipClient
            .getTransactionReceipt({
                client: walletClient as any,
                hash: '0x9a311a00b0ba4e5cb037b04ba44b0844da295f8af36722cf64fb1ebad97c2063',
            })
            .then((transactionReceipt) => {
                console.log(
                    `Transaction Receipt:\n
                    From: ${transactionReceipt.from}\n
                    To: ${transactionReceipt.to}\n
                    Block Number: ${transactionReceipt.blockNumber}\n
                    Status: ${transactionReceipt.status}\n
                    Type: ${transactionReceipt.type}\n
                `
                )
            })
            .catch((error) => {
                console.log(error)
            })
    }

    console.log('Test...')

    // approveRouter() // Failure: This occurred due to using an account address instead of an account object while calling the writeContract function. Details about the error can be found in the 'Discussions' tab of the Viem repository: https://github.com/wevm/viem/discussions/1452
    getAllowance()
    getOnRampAddress()
    getSupportedFeeTokens()
    getLaneRateRefillLimits()
    getTokenRateLimitByLane()
    getFee()
    getTokenAdminRegistry()
    isTokenSupported()
    // transferTokensPayLINK() // Failure: Same reason as in approveRouter()
    // transferTokensPayNative() // Failure: Same reason as in approveRouter()
    getTransferStatus()
    getTransactionReceipt()
}

test()