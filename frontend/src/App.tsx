import React from 'react';
import Layout from './Layout/Layout';
import Hero from './components/Hero';
import MovieCards from './components/MovieCards';
import MovieListCard from './components/MovieListCard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ListDetails from './components/ListDetails';
import UserLists from './components/UserLists';
import AllUserLists from './components/AllUserLists';
import CreateList from './components/CreateList';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import MovieSearch from './components/MovieSearch';
import NotFound from './components/NotFound';



const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<ProtectedRoute component={LoginForm} redirectTo="/" />} />
            <Route path="/signup" element={<ProtectedRoute component={SignupForm} redirectTo="/" />} />
            <Route path="/list/:listId" element={<ListDetails />} />
            <Route path="/userlists/:userId" element={<UserLists />} />
            <Route path="/create-list" element={<AuthenticatedRoute component={CreateList} />} />
            <Route path="/lists" element={<AllUserLists />} />
            <Route path="/movies" element={<MovieSearch />} />
            <Route path="/" element={
              <>
                <Hero />
                <MovieCards />
                <MovieListCard />
              </>
            } />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Layout>
      </Router>

    </AuthProvider>
  );
}

export default App;
