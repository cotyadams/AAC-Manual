import '../styles/Controls.css'
import speak from '../Functions/speak';
import navUpLayer from '../Functions/NavUpLayer';

function Controls({
    ttsContent,
    setTTsContent,
    setShowPassForm,
    showPassForm,
    showAdminScreen,
    setShowAdminScreen,
    setShowAdminForm,
    showAdminForm,
    addChild,
    setAddChild,
    data,
    setData,
    isSelectLeaf,
    setIsSelectLeaf,
    oldData,
    setOldData
}) {
    return (
        <div id="controls-container">
            <div className="controls-left">
                <button
                    onClick={() => navUpLayer({ data, setData, oldData, setOldData })}
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
                    onClick={() => {
                        setShowAdminScreen(false)
                        setShowAdminForm(true)
                    }}
                >
                    +
                </button>}
                {
                    addChild &&
                    <button
                        className="ctl-btn add-to-children"
                        onClick={() => {
                            setIsSelectLeaf({})
                            setShowAdminScreen(false)
                            setAddChild(false)
                        }
                        }

                    >
                        <span>Add to Children</span>
                    </button>
                }
            </div>
            <div className="controls-right">
                {true ? (
                    <button
                        onClick={() => {
                            if (!showAdminScreen && !showAdminForm) {
                                setShowPassForm(!showPassForm)
                            } else {
                                setShowAdminScreen(false)
                                setShowPassForm(false)
                                setShowAdminForm(false)
                            }
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
        </div >
    );
}

export default Controls;