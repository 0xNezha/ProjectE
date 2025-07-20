import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@react95/core';
import Binance from '../Binance';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true
  })
}));

// Mock zkTLS SDK
jest.mock('@primuslabs/zktls-js-sdk', () => ({
  PrimusZKTLS: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(true),
    generateRequestParams: jest.fn().mockReturnValue({
      setAttMode: jest.fn(),
      toJsonString: jest.fn().mockReturnValue('{}')
    }),
    sign: jest.fn().mockResolvedValue('signed_request'),
    startAttestation: jest.fn().mockResolvedValue({
      data: JSON.stringify({
        asset: 'BTC',
        amount: '1.5',
        valuationAmount: '45000',
        asset1: 'ETH',
        amount1: '10.5',
        valuationAmount1: '25000',
        asset2: 'BNB',
        amount2: '100',
        valuationAmount2: '30000'
      })
    }),
    verifyAttestation: jest.fn().mockResolvedValue(true)
  }))
}));

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Binance Component', () => {
  test('renders Binance verification interface', () => {
    renderWithTheme(<Binance />);
    
    expect(screen.getByText('🏦 Binance 资产验证')).toBeInTheDocument();
    expect(screen.getByText('🚀 启动验证')).toBeInTheDocument();
  });

  test('shows start verification button when wallet is connected', () => {
    renderWithTheme(<Binance />);
    
    const startButton = screen.getByText('🚀 启动验证');
    expect(startButton).toBeInTheDocument();
    expect(startButton).not.toBeDisabled();
  });

  test('displays explanation section', () => {
    renderWithTheme(<Binance />);
    
    expect(screen.getByText('📋 说明')).toBeInTheDocument();
    expect(screen.getByText(/本验证使用 zkTLS 技术/)).toBeInTheDocument();
  });
});
