import '../styles/SearchNoResultsPopup.css'

export default function SearchNoResultsPopup({ show, onClose }) {
    if (!show) return null;

    return (
        <div className="search-popup-overlay" onClick={onClose}>
            <div
                className="search-popup"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="search-popup-message"
                onClick={(event) => event.stopPropagation()}
            >
                <p id="search-popup-message">No nodes found</p>
                <button
                    className="btn search-popup-close-btn"
                    onClick={onClose}
                    autoFocus
                >
                    OK
                </button>
            </div>
        </div>
    );
}
