import { Frame } from '@react95/core'
import React from 'react'

function About() {
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
                <h1>🔷 Project E 🔶</h1>
                <p>
                <h2>勇敢的 E 卫兵啊，快去创造奇迹</h2>
                <h2>   (双击桌面图标开始操作)</h2>
                </p>

                <p>
                    本 计 划 的 目 的 是 寻 找 到 忠 诚 的  E  卫 兵👮 . . . . . .
                    <br/>
                    要 成 为 忠 诚 的 E 卫 兵 , 您 需 要 ：
                    <ul>
                        <li><b>💰️ETH 占个人BN账号资产的份额前五</b>:<br/>
                        这代表着您的资产大部分都是ETH，“忠诚！” 快把 BTC 换成 ETH 吧！</li>
                        <li><b>👮不同的 ETH 余额代表着不同的军衔</b>:<br/>
                        按照ETH 余额的多少，您将晋升为 E列兵、E中尉、E上尉、E少校、E中校、E上校、E大校、E少将、E中将、E上将、E元帅</li>
                        <li><b>💎投入激烈的加密战场，期待下一次新高</b>:<br/>
                        GM Frens! LFG! ALL IN ETH! TO DA MOON!</li>
                    </ul>
                </p>
            </Frame>
        </div>
    )
}

export default About