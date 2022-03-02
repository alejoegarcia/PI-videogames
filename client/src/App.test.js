import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store'
import rootReducer from './reducers'

import App from "./App";
import Button from "./components/Button";
import Footer from './components/Footer';
import ViewForm from "./components/ViewForm";
describe('Components test', () => {
    /*     beforeEach(() => {
            store = createTestStore();
          });
     */
    describe('App', () => {
        render(<Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>);
        it('should have the home button', () => {
            const homeButton = screen.getByText(/juegos/i);
            expect(homeButton).toBeInTheDocument();
        });
    });
    describe('Footer', () => {
        it('should have the credit text', () => {
            render(<Provider store={store}>
                <Router>
                    <Footer />
                </Router>
            </Provider>);
            const backgroundCreditText = screen.getByText("Background image credit");
            expect(backgroundCreditText).toBeInTheDocument();
            const linkText = screen.getByText("wallpapertip");
            expect(linkText).toBeInTheDocument();
        });
    });
    describe('Button', () => {
        it('should say this is the text', () => {
            render(
                <Router>
                    <Button click="/home" id="mockBtn" text="this is the text" disabled={false} />
                </Router>
            );
            const button = screen.getByText("this is the text");
            expect(button).toHaveAttribute("id", "mockBtn");
        });
    });
    describe('ViewForm', () => {
        it('should render "Buscar", "Borrar" and "Limpiar" buttons', () => {
            render(<Provider store={store}>
                <Router>
                    <ViewForm />
                </Router>
            </Provider>);

            expect(screen.getByText("Buscar")).toBeInTheDocument();
            expect(screen.getByText("Borrar búsqueda")).toBeInTheDocument();
            expect(screen.getByText("Limpiar filtros")).toBeInTheDocument();
        });
    });
});
