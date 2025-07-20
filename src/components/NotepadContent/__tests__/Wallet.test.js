import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@react95/core';
import Wallet from '../Wallet';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: () => ({
    address: null,
    isConnected: false,
    chain: null
  }),
  useConnect: () => ({
    connectors: [
      { uid: 'injected', name: 'Injected' },
      { uid: 'metamask', name: 'MetaMask' }
    ],
    connect: jest.fn(),
    isPending: false,
    error: null
  }),
  useDisconnect: () => ({
    disconnect: jest.fn()
  }),
  useBalance: () => ({
    data: null
  }),
  useSwitchChain: () => ({
    switchChain: jest.fn()
  })
}));

jest.mock('wagmi/chains', () => ({
  mainnet: { id: 1, name: 'Ethereum' },
  sepolia: { id: 11155111, name: 'Sepolia' }
}));

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Wallet Component', () => {
  test('renders wallet connection interface', () => {
    renderWithTheme(<Wallet />);
    
    expect(screen.getByText('钱包连接')).toBeInTheDocument();
    expect(screen.getByText('请连接您的钱包以继续使用服务')).toBeInTheDocument();
    expect(screen.getByText('连接钱包')).toBeInTheDocument();
  });

  test('shows connect button when not connected', () => {
    renderWithTheme(<Wallet />);
    
    const connectButton = screen.getByText('连接钱包');
    expect(connectButton).toBeInTheDocument();
    expect(connectButton).not.toBeDisabled();
  });
});
