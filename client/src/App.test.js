import { render, screen } from '@testing-library/react';

import Footer from './components/Footer';

test('Components test', () => {
    render(<Footer />);
    const backgroundCredit = screen.getByText(/background/i);
    expect(backgroundCredit).toBeInTheDocument();
});
