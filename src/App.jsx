import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AddTransactionModal from "./components/AddTransactionModal";
import TransactionsPage from "./components/TransactionsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import AuthPage from "./components/AuthPage";
import {
  createTransaction,
  deleteTransaction as deleteTransactionRequest,
  getTransactions,
  loginUser,
  signupUser,
  updateTransaction,
} from "./api/api";

const STORAGE_KEY = "spendly_user";

const normalizeTransaction = (tx) => ({
  ...tx,
  id: tx._id || tx.id,
  date: tx.date ? tx.date.slice(0, 10) : "",
});

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

const getApiErrorMessage = (err, fallback) => {
  if (err.response?.data?.error) return err.response.data.error;
  if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
    return "API server is not running. Start the backend on http://localhost:3000 and try again.";
  }
  return fallback;
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(() => getStoredUser());
  const isLoggedIn = Boolean(user?.id);

  useEffect(() => {
    if (!user?.id) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const loadTransactions = async () => {
      try {
        setLoading(true);
        const { data } = await getTransactions(user.id);
        const list = Array.isArray(data) ? data : data.transactions || [];
        setTransactions(list.map(normalizeTransaction));
        setError("");
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not load transactions."));
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user?.id]);

  const openAddModal = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const saveTransaction = async (tx) => {
    try {
      if (editingTransaction) {
        const { data } = await updateTransaction(editingTransaction.id, tx, user.id);
        const normalized = normalizeTransaction(data);
        setTransactions((prev) =>
          prev.map((item) => (item.id === editingTransaction.id ? normalized : item))
        );
      } else {
        const { data } = await createTransaction({ ...tx, user: user.id });
        setTransactions((prev) => [normalizeTransaction(data), ...prev]);
      }
      setError("");
      setModalOpen(false);
      setEditingTransaction(null);
    } catch (err) {
      const message = getApiErrorMessage(err, "Could not save transaction.");
      setError(message);
      throw new Error(message);
    }
  };

  const deleteTransaction = async (id) => {
    const previous = transactions;
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTransactionRequest(id, user.id);
      setError("");
    } catch (err) {
      setTransactions(previous);
      setError(getApiErrorMessage(err, "Could not delete transaction."));
    }
  };

  const handleAuth = async ({ mode, name, email, password }) => {
    try {
      const { data } =
        mode === "signup"
          ? await signupUser({ name, email, password })
          : await loginUser({ email, password });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      setUser(data.user);
      setError("");
    } catch (err) {
      throw new Error(getApiErrorMessage(err, "Could not authenticate user."));
    }

    const redirectTo = location.state?.from?.pathname || "/dashboard";
    navigate(redirectTo, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setTransactions([]);
    setModalOpen(false);
    setEditingTransaction(null);
    navigate("/login", { replace: true });
  };

  const protectedPage = (element) =>
    isLoggedIn ? element : <Navigate to="/login" replace state={{ from: location }} />;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onAuth={handleAuth} />}
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <AuthPage mode="signup" onAuth={handleAuth} />}
        />
        <Route
          path="/dashboard"
          element={protectedPage(
            <AppLayout user={user} isLoggedIn={isLoggedIn} onLogout={handleLogout}>
              <Dashboard
                transactions={transactions}
                onAddClick={openAddModal}
                onEdit={openEditModal}
                onDelete={deleteTransaction}
                loading={loading}
                error={error}
              />
            </AppLayout>
          )}
        />
        <Route
          path="/transactions"
          element={protectedPage(
            <AppLayout user={user} isLoggedIn={isLoggedIn} onLogout={handleLogout}>
              <TransactionsPage
                transactions={transactions}
                onAddClick={openAddModal}
                onEdit={openEditModal}
                onDelete={deleteTransaction}
                loading={loading}
                error={error}
              />
            </AppLayout>
          )}
        />
        <Route
          path="/analytics"
          element={protectedPage(
            <AppLayout user={user} isLoggedIn={isLoggedIn} onLogout={handleLogout}>
              <AnalyticsPage
                transactions={transactions}
                loading={loading}
                error={error}
              />
            </AppLayout>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {modalOpen && (
        <AddTransactionModal
          transaction={editingTransaction}
          onClose={() => {
            setModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={saveTransaction}
        />
      )}
    </>
  );
}

function AppLayout({ children, user, isLoggedIn, onLogout }) {
  return (
    <div className="flex h-screen bg-[#F8F7F4] font-sans overflow-hidden">
      <Sidebar isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
