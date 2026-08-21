import '../styles/Controls.css'
import speak from '../Functions/speak';

function Controls({ ttsContent, setTTsContent, setShowPassForm, showPassForm, showAdminScreen, setShowAdminScreen }) {
    return (
        <div id="controls-container">
            <div className="controls-left">
                <button
                    onClick={() => console.log('click')}
                    className="ctl-btn back-btn"
                    title="Go back to categories"
                >
                    ←
                </button>
                <button
                    onClick={() => console.log('click')}
                    className="ctl-btn search-btn"
                    title="Search symbols and categories"
                >
                    🔍
                </button>
                {showAdminScreen && <button
                    className="ctl-btn add-btn"
                    title="add TTS button"
                >
                    +
                </button>}
            </div>
            <div className="controls-right">
                {true ? (
                    <button
                        onClick={() => {
                            if (!showAdminScreen) setShowPassForm(!showPassForm);
                            setShowAdminScreen(false)
                        }}
                        className="ctl-btn admin-exit-btn"
                        title="Exit admin mode"
                    >
                        ⚙️
                    </button>
                ) : (
                    <button
                        onClick={() => console.log('click')}
                        className="ctl-btn admin-enter-btn"
                        title="Admin settings"
                    >
                        ⚙️
                    </button>
                )}
                <button
                    onClick={() => speak(ttsContent)}
                    className="ctl-btn speak-btn"
                    title="Speak text"
                >
                    🔊
                </button>
                <button
                    onClick={() => setTTsContent('')}
                    className="ctl-btn clear-btn"
                    title="Clear text"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default Controls;