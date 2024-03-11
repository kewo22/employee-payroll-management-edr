import { screen, render } from '@testing-library/react'

import Salaries from '@/app/(dashboard)/salaries/page'

it('should render heading and heading content', () => {
    render(<Salaries />)
    const el = screen.getByTestId('dashboard-heading')
    expect(el).toBeInTheDocument()
    expect(el.textContent).toEqual('Salaries')
})