import React, { useState, useEffect } from 'react'
import { Frame, Button } from '@react95/core'
import { useAccount } from 'wagmi'
import { PrimusZKTLS } from "@primuslabs/zktls-js-sdk"

// Initialize zkTLS SDK
let primusZKTLS = null;
let isInitialized = false;

const initializeZKTLS = async () => {
    if (!isInitialized) {
        primusZKTLS = new PrimusZKTLS();
        const appId = "0x3e417f4ea04079240f727883726ab91dd3baae22";
        const appSecret = "0x27b24ef40c61faad213061186ef6e836b0d5c3d2d9ad5ff529534d5bd27d7bb6";

        try {
            const initAttestaionResult = await primusZKTLS.init(appId, appSecret);
            console.log("primusProof initAttestaionResult=", initAttestaionResult);
            isInitialized = true;
            return true;
        } catch (error) {
            console.error("zkTLS 初始化失败:", error);
            return false;
        }
    }
    return true;
};

export async function primusProof(userAddress) {
    try {
        // 确保 zkTLS 已初始化
        if (!isInitialized) {
            const initSuccess = await initializeZKTLS();
            if (!initSuccess) {
                throw new Error("zkTLS 初始化失败");
            }
        }

        // Set TemplateID and user address.
        const attTemplateID = "3d7ebb28-7b14-4e56-bb15-9616af9fef94";

        // Generate attestation request.
        const request = primusZKTLS.generateRequestParams(attTemplateID, userAddress);

        // Set zkTLS mode, default is proxy model. (This is optional)
        const workMode = "proxytls";
        request.setAttMode({
            algorithmType: workMode,
        });

        // Transfer request object to string.
        const requestStr = request.toJsonString();

        // Sign request.
        const signedRequestStr = await primusZKTLS.sign(requestStr);

        // Start attestation process.
        const attestation = await primusZKTLS.startAttestation(signedRequestStr);
        console.log("attestation=", attestation);
        console.log("返回数据 attestation.data=", attestation.data);

        // 解析并按顺序处理数据
        const parsedData = JSON.parse(attestation.data);
        console.log("解析后的数据:", parsedData);

        // 收集前5名资产
        const topAssets = [];

        // 首先处理主资产
        if (parsedData.asset) {
            topAssets.push({
                symbol: parsedData.asset,
                amount: parseFloat(parsedData.amount || 0),
                valuation: parseFloat(parsedData.valuationAmount || 0)
            });
        }

        // 然后处理 asset1 到 asset5
        for (let i = 1; i <= 5; i++) {
            if (parsedData[`asset${i}`] && topAssets.length < 5) {
                topAssets.push({
                    symbol: parsedData[`asset${i}`],
                    amount: parseFloat(parsedData[`amount${i}`] || 0),
                    valuation: parseFloat(parsedData[`valuationAmount${i}`] || 0)
                });
            }
        }

        console.log("前5名资产:", topAssets);

        // Verify signature.
        const verifyResult = await primusZKTLS.verifyAttestation(attestation);
        console.log("verifyResult=", verifyResult);

        if (verifyResult === true) {
            return {
                success: true,
                assets: topAssets,
                rawData: parsedData
            };
        } else {
            throw new Error("验证失败");
        }
    } catch (error) {
        console.error("primusProof 错误:", error);
        return {
            success: false,
            error: error.message || "验证过程中发生错误"
        };
    }
}
    

// 获取军衔函数
const getRank = (ethAmount) => {
    if (ethAmount < 1) return "E列兵";
    if (ethAmount >= 1 && ethAmount < 2) return "E中尉";
    if (ethAmount >= 2 && ethAmount < 3) return "E上尉";
    if (ethAmount >= 3 && ethAmount < 5) return "E少校";
    if (ethAmount >= 5 && ethAmount < 7) return "E中校";
    if (ethAmount >= 7 && ethAmount < 10) return "E大校";
    if (ethAmount >= 10 && ethAmount < 20) return "E少将";
    if (ethAmount >= 20 && ethAmount < 40) return "E中将";
    if (ethAmount >= 40 && ethAmount < 70) return "E上将";
    if (ethAmount >= 70) return "E元帅";
    return "E列兵";
};

function Binance() {
    const { address, isConnected } = useAccount();
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const [error, setError] = useState(null);
    const [isInitializing, setIsInitializing] = useState(false);

    // 初始化 zkTLS
    useEffect(() => {
        const init = async () => {
            if (!isInitialized) {
                setIsInitializing(true);
                await initializeZKTLS();
                setIsInitializing(false);
            }
        };
        init();
    }, []);

    const handleStartVerification = async () => {
        if (!isConnected || !address) {
            setError("请先连接钱包");
            return;
        }

        setIsVerifying(true);
        setError(null);
        setVerificationResult(null);

        try {
            const result = await primusProof(address);

            if (result.success) {
                // 分析资产数据
                const assets = result.assets.slice(0, 5); // 确保只取前5名
                const hasETH = assets.some(asset =>
                    asset.symbol.toUpperCase() === 'ETH' ||
                    asset.symbol.toUpperCase() === 'ETHEREUM'
                );

                let ethAmount = 0;
                if (hasETH) {
                    const ethAsset = assets.find(asset =>
                        asset.symbol.toUpperCase() === 'ETH' ||
                        asset.symbol.toUpperCase() === 'ETHEREUM'
                    );
                    ethAmount = ethAsset ? ethAsset.amount : 0;
                }

                setVerificationResult({
                    assets,
                    hasETH,
                    ethAmount,
                    rank: hasETH ? getRank(ethAmount) : null
                });
            } else {
                setError(result.error || "验证失败");
            }
        } catch (err) {
            console.error("验证错误:", err);
            setError(err.message || "验证过程中发生错误");
        } finally {
            setIsVerifying(false);
        }
    };

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
                <h2>🏦 Binance 资产验证</h2>

                <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                        使用 zkTLS 技术验证您的 Binance 资产，保护隐私的同时证明资产持有情况。
                    </p>

                    {!isConnected && (
                        <div style={{
                            padding: '10px',
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffeaa7',
                            borderRadius: '4px',
                            fontSize: '12px',
                            marginBottom: '15px'
                        }}>
                            ⚠️ 请先连接钱包以开始验证
                        </div>
                    )}

                    {isInitializing && (
                        <div style={{
                            padding: '10px',
                            backgroundColor: '#e3f2fd',
                            border: '1px solid #90caf9',
                            borderRadius: '4px',
                            fontSize: '12px',
                            marginBottom: '15px'
                        }}>
                            🔄 正在初始化 zkTLS SDK...
                        </div>
                    )}
                </div>

                {/* 启动验证按钮 */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Button
                        onClick={handleStartVerification}
                        disabled={!isConnected || isVerifying || isInitializing}
                        style={{
                            padding: '12px 24px',
                            fontSize: '14px',
                            minWidth: '120px',
                            backgroundColor: isVerifying ? '#ccc' : '#007bff',
                            color: 'white'
                        }}
                    >
                        {isVerifying ? '🔄 验证中...' : '🚀 启动验证'}
                    </Button>
                </div>

                {/* 错误信息 */}
                {error && (
                    <div style={{
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '4px',
                        fontSize: '14px',
                        color: '#721c24'
                    }}>
                        ❌ {error}
                    </div>
                )}

                {/* 验证结果 */}
                {verificationResult && (
                    <div style={{
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ marginBottom: '15px', color: '#495057' }}>
                            📊 验证结果
                        </h3>

                        {/* E卫兵认证 */}
                        <div style={{
                            padding: '15px',
                            backgroundColor: verificationResult.hasETH ? '#d4edda' : '#f8d7da',
                            border: `1px solid ${verificationResult.hasETH ? '#c3e6cb' : '#f5c6cb'}`,
                            borderRadius: '4px',
                            marginBottom: '15px'
                        }}>
                            <div style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                marginBottom: '10px',
                                color: verificationResult.hasETH ? '#155724' : '#721c24'
                            }}>
                                {verificationResult.hasETH ? '🎖️ E卫兵认证' : '❌ E卫兵认证'}
                            </div>

                            <div style={{
                                fontSize: '14px',
                                color: verificationResult.hasETH ? '#155724' : '#721c24'
                            }}>
                                {verificationResult.hasETH
                                    ? "🎉 向您致敬，忠诚的 E卫兵！恁真🀄️"
                                    : "😔 很抱歉，您还没有达到E卫兵的标准"
                                }
                            </div>
                        </div>

                        {/* 军衔显示 */}
                        {verificationResult.hasETH && (
                            <div style={{
                                padding: '15px',
                                backgroundColor: '#fff3cd',
                                border: '1px solid #ffeaa7',
                                borderRadius: '4px',
                                textAlign: 'center',
                                marginBottom: '20px'
                            }}>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                    color: '#856404'
                                }}>
                                    🏆️ 军衔认证
                                </div>

                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#d39e00',
                                    marginBottom: '10px'
                                }}>
                                    {verificationResult.rank}
                                </div>

                                <div style={{
                                    fontSize: '12px',
                                    color: '#856404'
                                }}>
                                    ETH 持有量: {verificationResult.ethAmount.toFixed(6)} ETH
                                </div>
                            </div>
                        )}

                        {/* 前5名资产列表 */}
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ marginBottom: '10px', fontSize: '16px' }}>
                                💰️ 资产排名 (前5名)
                            </h4>
                            {verificationResult.assets.map((asset, index) => (
                                <div key={index} style={{
                                    padding: '10px',
                                    backgroundColor: 'white',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '4px',
                                    marginBottom: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                            #{index + 1} {asset.symbol}
                                        </span>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '12px' }}>
                                        <div>数量: {asset.amount.toFixed(6)}</div>
                                        <div style={{ color: '#28a745' }}>
                                            估值: ${asset.valuation.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 说明信息 */}
                <div style={{
                    padding: '15px',
                    backgroundColor: '#e9ecef',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#6c757d'
                }}>
                    <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>📋 说明</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>本验证使用 zkTLS 技术，确保数据真实性的同时保护您的隐私</li>
                        <li>只显示资产排名前5的币种信息</li>
                        <li>E卫兵认证需要在前5名资产中持有 ETH</li>
                        <li>军衔根据 ETH 持有量确定：列兵(&lt;1) → 中尉(1-2) → 上尉(2-3) → 少校(3-5) → 中校(5-7) → 大校(7-10) → 少将(10-20) → 中将(20-40) → 上将(40-70) → 元帅(≥70)</li>
                    </ul>
                </div>
            </Frame>
        </div>
    );
}

export default Binance