import React, { useState, useEffect } from 'react'
import { Frame, Button, Modal } from '@react95/core'
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

function Wallet() {
    const { address, isConnected, chain } = useAccount()
    const { connectors, connect, isPending, error } = useConnect()
    const { disconnect } = useDisconnect()
    const { data: balance } = useBalance({
        address: address,
        enabled: !!address && isConnected, // 只有在连接时才获取余额
    })
    const { switchChain } = useSwitchChain()
    const [showConnectModal, setShowConnectModal] = useState(false)
    const [showError, setShowError] = useState(false)
    const [showNetworkModal, setShowNetworkModal] = useState(false)
    const [connectionError, setConnectionError] = useState(null)

    // 清除错误状态
    useEffect(() => {
        if (isConnected) {
            setShowError(false)
            setConnectionError(null)
        }
    }, [isConnected])

    // 清除连接错误
    useEffect(() => {
        if (!error) {
            setConnectionError(null)
        }
    }, [error])

    const handleConnectClick = () => {
        setShowConnectModal(true)
        setShowError(false)
        setConnectionError(null)
    }

    const handleConnectorClick = async (connector) => {
        try {
            setShowError(false)
            setConnectionError(null)

            // 检查连接器是否可用
            if (!connector) {
                throw new Error('连接器不可用')
            }

            await connect({ connector })
            setShowConnectModal(false)
        } catch (err) {
            console.error('连接失败:', err)

            // 处理不同类型的错误
            let errorMessage = '连接失败，请重试'

            if (err.message?.includes('User rejected')) {
                errorMessage = '用户取消了连接请求'
            } else if (err.message?.includes('No provider')) {
                errorMessage = '未检测到钱包，请安装 MetaMask 或其他钱包'
            } else if (err.message?.includes('Already processing')) {
                errorMessage = '正在处理连接请求，请稍候'
            } else if (err.message) {
                errorMessage = err.message
            }

            setConnectionError(errorMessage)
            setShowError(true)
        }
    }

    const handleDisconnect = () => {
        disconnect()
        setShowError(false)
    }

    const handleSwitchNetwork = (chainId) => {
        switchChain({ chainId })
        setShowNetworkModal(false)
    }

    const formatAddress = (addr) => {
        if (!addr) return ''
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    return (
        <div>
            <Frame
                bg="white"
                boxShadow="in"
                height="100%"
                padding={20}
                style={{
                    overflowY: "auto",
                    maxHeight: "60vh",
                }}
            >
                <h2>钱包连接</h2>

                {!isConnected ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                            请连接您的钱包以继续使用服务
                        </p>

                        {/* 错误提示 */}
                        {(connectionError || showError) && (
                            <div style={{
                                marginBottom: '15px',
                                padding: '10px',
                                backgroundColor: '#ffe6e6',
                                border: '1px solid #ff9999',
                                borderRadius: '4px',
                                fontSize: '12px',
                                color: '#cc0000'
                            }}>
                                {connectionError || '请确保已安装钱包插件'}
                            </div>
                        )}

                        <Button
                            onClick={handleConnectClick}
                            disabled={isPending}
                            style={{
                                padding: '10px 20px',
                                fontSize: '14px',
                                minWidth: '120px'
                            }}
                        >
                            {isPending ? '连接中...' : '连接钱包'}
                        </Button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{
                            marginBottom: '20px',
                            padding: '15px',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
                                钱包已连接
                            </p>
                            <p style={{
                                margin: '0 0 10px 0',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                wordBreak: 'break-all'
                            }}>
                                地址: {formatAddress(address)}
                            </p>
                            {balance && (
                                <p style={{
                                    margin: '0 0 10px 0',
                                    fontSize: '12px',
                                    color: '#333'
                                }}>
                                    余额: {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                                </p>
                            )}
                            {chain && (
                                <p style={{
                                    margin: '0',
                                    fontSize: '12px',
                                    color: '#666'
                                }}>
                                    网络: {chain.name} (ID: {chain.id})
                                </p>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                onClick={() => setShowNetworkModal(true)}
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '12px',
                                    minWidth: '100px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white'
                                }}
                            >
                                切换网络
                            </Button>
                            <Button
                                onClick={handleDisconnect}
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '12px',
                                    minWidth: '100px',
                                    backgroundColor: '#ff6b6b',
                                    color: 'white'
                                }}
                            >
                                断开连接
                            </Button>
                        </div>
                    </div>
                )}

                {/* 连接钱包模态框 */}
                {showConnectModal && (
                    <Modal
                        title="选择钱包"
                        closeModal={() => setShowConnectModal(false)}
                        buttons={[
                            { value: "取消", onClick: () => setShowConnectModal(false) }
                        ]}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '300px',
                            zIndex: 1000
                        }}
                    >
                        <div style={{ padding: '20px' }}>
                            <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                                请选择您要使用的钱包：
                            </p>

                            {/* 错误提示 */}
                            {(connectionError || showError) && (
                                <div style={{
                                    marginBottom: '15px',
                                    padding: '10px',
                                    backgroundColor: '#ffe6e6',
                                    border: '1px solid #ff9999',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    color: '#cc0000'
                                }}>
                                    {connectionError || '连接失败，请重试'}
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {connectors.map((connector) => {
                                    // 为不同的连接器添加图标
                                    const getConnectorIcon = (name) => {
                                        if (name.toLowerCase().includes('metamask')) return '🦊'
                                        if (name.toLowerCase().includes('walletconnect')) return '🔗'
                                        if (name.toLowerCase().includes('coinbase')) return '🔵'
                                        if (name.toLowerCase().includes('injected')) return '💼'
                                        return '🔗'
                                    }

                                    return (
                                        <Button
                                            key={connector.uid}
                                            onClick={() => handleConnectorClick(connector)}
                                            disabled={isPending}
                                            style={{
                                                padding: '12px',
                                                fontSize: '14px',
                                                textAlign: 'left',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                opacity: isPending ? 0.6 : 1
                                            }}
                                        >
                                            <span style={{ fontSize: '18px' }}>
                                                {getConnectorIcon(connector.name)}
                                            </span>
                                            {connector.name}
                                            {isPending && <span style={{ fontSize: '12px', marginLeft: 'auto' }}>连接中...</span>}
                                        </Button>
                                    )
                                })}
                            </div>

                            {connectors.length === 0 && (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    color: '#666'
                                }}>
                                    未检测到可用的钱包连接器
                                </div>
                            )}
                        </div>
                    </Modal>
                )}

                {/* 网络切换模态框 */}
                {showNetworkModal && (
                    <Modal
                        title="切换网络"
                        closeModal={() => setShowNetworkModal(false)}
                        buttons={[
                            { value: "取消", onClick: () => setShowNetworkModal(false) }
                        ]}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '300px',
                            zIndex: 1000
                        }}
                    >
                        <div style={{ padding: '20px' }}>
                            <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                                选择要切换到的网络：
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Button
                                    onClick={() => handleSwitchNetwork(mainnet.id)}
                                    disabled={chain?.id === mainnet.id}
                                    style={{
                                        padding: '12px',
                                        fontSize: '14px',
                                        textAlign: 'left',
                                        backgroundColor: chain?.id === mainnet.id ? '#f0f0f0' : 'white',
                                        opacity: chain?.id === mainnet.id ? 0.6 : 1
                                    }}
                                >
                                    🔗 {mainnet.name} {chain?.id === mainnet.id && '(当前)'}
                                </Button>
                                <Button
                                    onClick={() => handleSwitchNetwork(sepolia.id)}
                                    disabled={chain?.id === sepolia.id}
                                    style={{
                                        padding: '12px',
                                        fontSize: '14px',
                                        textAlign: 'left',
                                        backgroundColor: chain?.id === sepolia.id ? '#f0f0f0' : 'white',
                                        opacity: chain?.id === sepolia.id ? 0.6 : 1
                                    }}
                                >
                                    🧪 {sepolia.name} {chain?.id === sepolia.id && '(当前)'}
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </Frame>
        </div>
    )
}

export default Wallet