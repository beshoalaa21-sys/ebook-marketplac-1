"use client";

import { FormEvent, useMemo, useState } from "react";

type Language = "ar" | "en";
type View = "home" | "store" | "cart" | "dashboard" | "authors" | "becomeAuthor";
type UserRole = "reader" | "author";

type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  genreKey: "romance" | "horror";
  price: number;
  rating: number;
  reviews: number;
  description: string;
  pages: number;
};

type User = {
  name: string;
  role: UserRole;
};

const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: "همسات الليل",
    author: "أحمد محمد",
    genre: "رومانسي",
    genreKey: "romance",
    price: 29.99,
    rating: 4.8,
    reviews: 124,
    description: "رواية رومانسية عميقة تحكي قصة حب لا تُنسى بين شخصين من عالمين مختلفين.",
    pages: 320,
  },
  {
    id: 2,
    title: "في ظلام الغابة",
    author: "سارة علي",
    genre: "رعب",
    genreKey: "horror",
    price: 24.99,
    rating: 4.6,
    reviews: 89,
    description: "رواية رعب نفسية مثيرة تأخذك في رحلة مظلمة عبر غابة غامضة.",
    pages: 280,
  },
  {
    id: 3,
    title: "قلب الذهب",
    author: "فاطمة يوسف",
    genre: "رومانسي",
    genreKey: "romance",
    price: 19.99,
    rating: 4.9,
    reviews: 203,
    description: "قصة حب عابرة للزمن تجمع بين الأمس واليوم بخيوط ذهبية رقيقة.",
    pages: 250,
  },
  {
    id: 4,
    title: "الصرخة الصامتة",
    author: "خالد نور",
    genre: "رعب",
    genreKey: "horror",
    price: 26.99,
    rating: 4.5,
    reviews: 67,
    description: "رواية رعب تأخذك إلى عمق الخوف والظلام حيث تختفي الحقيقة.",
    pages: 340,
  },
  {
    id: 5,
    title: "أشعة الأمل",
    author: "ليلى حسن",
    genre: "رومانسي",
    genreKey: "romance",
    price: 22.99,
    rating: 4.7,
    reviews: 156,
    description: "رواية درامية رقيقة عن الحب والأمل والثانية فرصة في الحياة.",
    pages: 290,
  },
  {
    id: 6,
    title: "الليل الأبدي",
    author: "محمود إبراهيم",
    genre: "رعب",
    genreKey: "horror",
    price: 27.99,
    rating: 4.4,
    reviews: 45,
    description: "رواية رعب غامضة تحكي عن مدينة لا تعرف الضوء أبداً.",
    pages: 310,
  },
];

const translations = {
  ar: {
    home: "الرئيسية",
    store: "المتجر",
    cart: "السلة",
    dashboard: "لوحة المتابعة",
    authors: "الكتّاب",
    becomeAuthor: "كن مؤلفاً",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    welcome: "سوق الكتب الإلكترونية",
    subtitle: "اكتشف وشتري أفضل الروايات والقصص",
    search: "ابحث عن كتاب...",
    genre: "النوع:",
    addToCart: "إضافة للسلة",
    buyNow: "شراء الآن",
    read: "اقرأ",
    rating: "التقييم",
    pages: "صفحات",
    by: "بقلم",
    totalPrice: "الإجمالي:",
    removeFromCart: "حذف",
    checkoutEmpty: "السلة فارغة",
    proceedToCheckout: "إتمام الشراء",
    myBooks: "كتبي",
    myEarnings: "أرباحي",
    publishBook: "نشر كتاب",
    followers: "متابعون",
    sales: "مبيعات",
    register: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    name: "الاسم",
    bio: "السيرة الذاتية",
    applyAsAuthor: "تقديم طلب المؤلف",
    allGenres: "جميع الأنواع",
    romance: "رومانسي",
    horror: "رعب",
    noBooksFound: "لم يتم العثور على كتب",
    guestRole: "قارئ",
    authorRole: "مؤلف",
    welcomeUser: "مرحباً",
    authorDashboardHint: "سجل الدخول كمؤلف لرؤية لوحة المتابعة",
    follow: "متابعة",
    followAuthors: "متابعة",
  },
  en: {
    home: "Home",
    store: "Store",
    cart: "Cart",
    dashboard: "Dashboard",
    authors: "Authors",
    becomeAuthor: "Become Author",
    logout: "Logout",
    login: "Login",
    welcome: "E-Book Marketplace",
    subtitle: "Discover and buy the best novels and stories",
    search: "Search for a book...",
    genre: "Genre:",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    read: "Read",
    rating: "Rating",
    pages: "Pages",
    by: "By",
    totalPrice: "Total:",
    removeFromCart: "Remove",
    checkoutEmpty: "Cart is empty",
    proceedToCheckout: "Checkout",
    myBooks: "My Books",
    myEarnings: "My Earnings",
    publishBook: "Publish Book",
    followers: "Followers",
    sales: "Sales",
    register: "Register",
    email: "Email",
    password: "Password",
    name: "Name",
    bio: "Biography",
    applyAsAuthor: "Apply as Author",
    allGenres: "All Genres",
    romance: "Romance",
    horror: "Horror",
    noBooksFound: "No books found",
    guestRole: "Reader",
    authorRole: "Author",
    welcomeUser: "Welcome",
    authorDashboardHint: "Log in as an author to view the dashboard",
    follow: "Follow",
    followAuthors: "Follow",
  },
} as const;

export default function Page() {
  const [language, setLanguage] = useState<Language>("ar");
  const [currentView, setCurrentView] = useState<View>("home");
  const [cart, setCart] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState<"all" | "romance" | "horror">("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authorForm, setAuthorForm] = useState({ name: "", email: "", bio: "" });

  const t = translations[language];

  const filteredBooks = useMemo(() => {
    const searched = searchTerm.trim().toLowerCase();
    return INITIAL_BOOKS.filter((book) => {
      const titleMatch = book.title.toLowerCase().includes(searched);
      const authorMatch = book.author.toLowerCase().includes(searched);
      const genreMatch =
        genreFilter === "all" ||
        (genreFilter === "romance" && book.genreKey === "romance") ||
        (genreFilter === "horror" && book.genreKey === "horror");

      return (titleMatch || authorMatch) && genreMatch;
    });
  }, [genreFilter, searchTerm]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const addToCart = (book: Book) => {
    setCart((prev) => (prev.some((item) => item.id === book.id) ? prev : [...prev, book]));
  };

  const removeFromCart = (bookId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  const submitAuthorApplication = (event: FormEvent) => {
    event.preventDefault();
    if (!authorForm.name || !authorForm.email) return;

    setUser({ name: authorForm.name, role: "author" });
    setCurrentView("home");
    setAuthorForm({ name: "", email: "", bio: "" });
  };

  const renderHome = () => (
    <>
      <section className="hero">
        <h1>{t.welcome}</h1>
        <p>{t.subtitle}</p>
      </section>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.search}
        />

        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value as "all" | "romance" | "horror")}>
          <option value="all">{t.allGenres}</option>
          <option value="romance">{t.romance}</option>
          <option value="horror">{t.horror}</option>
        </select>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <article key={book.id} className="book-card">
              <div className="book-cover">
                <span className="price-badge">${book.price}</span>
                <div className="book-cover-text">{book.title}</div>
              </div>

              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">
                  {t.by} {book.author}
                </p>
                <span className="book-genre">{book.genre}</span>
                <div className="book-rating">
                  ⭐ {book.rating} ({book.reviews})
                </div>
                <div className="book-actions">
                  <button onClick={() => setSelectedBook(book)}>{t.read}</button>
                  <button onClick={() => addToCart(book)}>{t.addToCart}</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <p>{t.noBooksFound}</p>
        </div>
      )}
    </>
  );

  const renderCart = () => (
    <>
      <h2 className="page-title">{t.cart}</h2>

      {cart.length > 0 ? (
        <div className="cart-section">
          {cart.map((item, idx) => (
            <div key={item.id} className={`cart-item ${idx === cart.length - 1 ? "cart-item-last" : ""}`}>
              <div>
                <div className="cart-item-title">{item.title}</div>
                <div className="cart-item-author">{item.author}</div>
              </div>
              <div className="cart-item-controls">
                <span>${item.price}</span>
                <button className="small-btn" onClick={() => removeFromCart(item.id)}>
                  {t.removeFromCart}
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <span>{t.totalPrice}</span>
            <span>${cartTotal}</span>
          </div>

          <button className="checkout-btn">{t.proceedToCheckout}</button>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <p>{t.checkoutEmpty}</p>
        </div>
      )}
    </>
  );

  const renderDashboard = () => (
    <>
      <h2 className="page-title">{t.dashboard}</h2>
      {user && user.role === "author" ? (
        <div className="dashboard">
          <div className="dashboard-card">
            <div className="dashboard-card-title">{t.myBooks}</div>
            <div className="dashboard-card-value">3</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-title">{t.followers}</div>
            <div className="dashboard-card-value">156</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-title">{t.sales}</div>
            <div className="dashboard-card-value">2,340</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-title">{t.myEarnings}</div>
            <div className="dashboard-card-value">$1,820</div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>{t.authorDashboardHint}</p>
        </div>
      )}
    </>
  );

  const renderAuthors = () => (
    <>
      <h2 className="page-title">{t.authors}</h2>
      <div className="author-list">
        {[
          { name: "أحمد محمد", books: 5, followers: 1240 },
          { name: "سارة علي", books: 3, followers: 856 },
          { name: "فاطمة يوسف", books: 7, followers: 2103 },
        ].map((author) => (
          <div key={author.name} className="author-item">
            <div className="author-info">
              <div className="author-name">{author.name}</div>
              <div className="author-stats">
                {author.books} كتب • {author.followers} متابع
              </div>
            </div>
            <button>{t.follow}</button>
          </div>
        ))}
      </div>
    </>
  );

  const renderBecomeAuthor = () => (
    <>
      <h2 className="page-title">{t.becomeAuthor}</h2>
      <div className="user-section">
        <form onSubmit={submitAuthorApplication}>
          <div className="form-group">
            <label>{t.name}</label>
            <input
              type="text"
              value={authorForm.name}
              onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.email}</label>
            <input
              type="email"
              value={authorForm.email}
              onChange={(e) => setAuthorForm({ ...authorForm, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.bio}</label>
            <textarea
              value={authorForm.bio}
              onChange={(e) => setAuthorForm({ ...authorForm, bio: e.target.value })}
              placeholder="اخبرنا عن نفسك..."
            />
          </div>

          <button type="submit" className="wide-btn">
            {t.applyAsAuthor}
          </button>
        </form>
      </div>
    </>
  );

  const renderCurrentView = () => {
    if (currentView === "cart") return renderCart();
    if (currentView === "dashboard") return renderDashboard();
    if (currentView === "authors") return renderAuthors();
    if (currentView === "becomeAuthor") return renderBecomeAuthor();
    return renderHome();
  };

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="header-content">
          <button className="brand" onClick={() => setCurrentView("home")}>
            سوق الكتب 📚
          </button>

          <nav className="nav-buttons">
            <button onClick={() => setCurrentView("home")}>{t.home}</button>
            <button onClick={() => setCurrentView("store")}>{t.store}</button>
            <button onClick={() => setCurrentView("authors")}>{t.authors}</button>
            <button onClick={() => setCurrentView("cart")}>
              {t.cart}
              {cart.length > 0 && <span className="cart-count">({cart.length})</span>}
            </button>
            <button onClick={() => setCurrentView("dashboard")}>{t.dashboard}</button>

            {!user && <button onClick={() => setUser({ name: "أحمد محمد", role: "reader" })}>{t.login}</button>}
            {!user && <button onClick={() => setCurrentView("becomeAuthor")}>{t.becomeAuthor}</button>}
            {user && <button onClick={() => setUser(null)}>{t.logout}</button>}

            <button className="language-toggle" onClick={() => setLanguage(language === "ar" ? "en" : "ar")}>
              {language === "ar" ? "English" : "العربية"}
            </button>
          </nav>
        </div>
      </header>

      <div className="container">
        {user && (
          <div className="user-section">
            <div className="user-welcome">
              {t.welcomeUser} {user.name} 👋
            </div>
            <p className="user-role">
              {user.role === "author" ? t.authorRole : t.guestRole}
            </p>
          </div>
        )}

        {renderCurrentView()}
      </div>

      {selectedBook && (
        <div className="modal-overlay active" onClick={() => setSelectedBook(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedBook.title}</h2>
              <button className="close-btn" onClick={() => setSelectedBook(null)}>
                ×
              </button>
            </div>

            <div className="book-details">
              <div className="book-details-cover">
                <div className="book-details-emoji">📖</div>
              </div>

              <div className="book-details-text">
                <h2>{selectedBook.title}</h2>
                <p>
                  <strong>{t.by}:</strong> {selectedBook.author}
                </p>
                <p>
                  <strong>{t.genre}:</strong> {selectedBook.genre}
                </p>
                <p>
                  <strong>{t.totalPrice}:</strong> ${selectedBook.price}
                </p>
                <p>
                  <strong>{t.rating}:</strong> ⭐ {selectedBook.rating} ({selectedBook.reviews} تقييم)
                </p>
                <p>
                  <strong>{t.pages}:</strong> {selectedBook.pages}
                </p>
                <p className="book-description">{selectedBook.description}</p>

                <div className="modal-actions">
                  <button onClick={() => addToCart(selectedBook)}>{t.addToCart}</button>
                  <button onClick={() => addToCart(selectedBook)}>{t.buyNow}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
