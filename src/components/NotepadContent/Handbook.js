import { Frame } from '@react95/core'
import React, { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const tomlCode = `
    [dependencies]
    etf-contract-utils = { git = "https://github.com/ideal-lab5/contracts", default-features = false, features = ["ink-as-dependency"] }

    [features]
    std = [
        "etf-contract-utils/std",
    ]
  `;

const envConfigCode = `
    use etf_contract_utils::ext::EtfEnvironment;
    #[ink::contract(env = EtfEnvironment)]
    mod your_smart_contract {
        use crate::EtfEnvironment;
        ...
    }`;

const chainExtCode = `
    let rand: [u8;48] = self.env()
        .extension()
        .secret();`;

function Handbook() {

    const [copiedToml, setCopiedToml] = useState(false);
    const [copiedEnv, setCopiedEnv] = useState(false);
    const [copiedExt, setCopiedExt] = useState(false);

    const handleCopy = (id) => {
        switch (id) {
            case 'toml':
                setCopiedToml(true);
                setTimeout(() => setCopiedToml(false), 1500);
                break;
            case 'env':
                setCopiedEnv(true);
                setTimeout(() => setCopiedEnv(false), 1500);
                break;
            case 'ext':
                setCopiedExt(true);
                setTimeout(() => setCopiedExt(false), 1500);
                break;
            default:
                // do nothing
        }
    //   setCopied(true);
      
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
                <h2>帮助文档</h2>
                <p>
                    先安装 primus 扩展，再连接钱包，然后验证 BN ！
                </p>
            </Frame>
        </div>
    )
}

export default Handbook