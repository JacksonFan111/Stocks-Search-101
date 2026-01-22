# Stock Search 101

A modern, full-stack stock search application built with React, Vite, Tailwind CSS, and the Finnhub API.

## 🚀 Features

- **Real-time Stock Search**: Search for any stock symbol (AAPL, TSLA, GOOGL, etc.)
- **Live Stock Quotes**: Get current price, daily high/low, open, and previous close
- **Company Information**: View detailed company profiles, industry, market cap, and more
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Fast Performance**: Built with Vite for lightning-fast development and production builds

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **API**: Finnhub (free tier)
- **HTTP Client**: Axios

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. The API key is already configured in `.env` file

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## 🎯 Usage

1. **Search for a stock**: Enter a stock symbol (e.g., AAPL, TSLA) in the search bar
2. **Select from results**: Click on any search result to view detailed information
3. **View stock details**: See real-time quotes, price changes, and company information
4. **Quick access**: Click on any of the popular stock buttons for instant search

## 📁 Project Structure

```
Stocks-Search-101/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx       # Search input component
│   │   ├── SearchResults.jsx   # Display search results
│   │   └── StockDetails.jsx    # Detailed stock information
│   ├── services/
│   │   └── finnhubAPI.js       # API service layer
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env                        # API configuration
```

## 🔑 API Endpoints Used

- `/search` - Search for stocks by symbol
- `/quote` - Get real-time stock quotes
- `/stock/profile2` - Get company profile information

## 🎨 Features in Detail

### Search Functionality
- Instant search with debouncing
- Filters common stocks from major US exchanges
- Shows up to 20 relevant results

### Stock Details
- Current price with real-time updates
- Daily price change (amount and percentage)
- High, low, open, and previous close prices
- Company logo and information
- Market capitalization
- Industry and country information
- Direct link to company website

### UI/UX
- Responsive design for all screen sizes
- Dark mode support
- Smooth animations and transitions
- Loading states and error handling
- Clean, modern interface

## 🚀 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 📝 Notes

- The free Finnhub API has rate limits (60 calls/minute)
- Some stocks may have limited information depending on availability
- Market data is real-time during market hours

## 🤝 Contributing

Feel free to fork, modify, and create pull requests!

## 📄 License

MIT License - feel free to use this project for learning or personal use.

---

Built with ❤️ using React, Vite, and Tailwind CSS
