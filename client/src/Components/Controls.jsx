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
    setOldData,
    showAllNodes,
    setShowAllNodes,
    currentParentId,
    setCurrentParentId,
    oldParentIds,
    setOldParentIds
}) {
    return (
        <div id="controls-container">
            <div className="controls-left">
                <button
                    style={showAdminScreen && oldData.length == 0 ? { backgroundColor: "lightgray" } : {}}
                    onClick={
                        () => {
                            if (showAdminForm) {
                                setShowAdminForm(false);
                                setShowAdminScreen(true);
                            } else if (showPassForm) {
                                setShowPassForm(false)
                            }
                            else { navUpLayer({ data, setData, oldData, setOldData, oldParentIds, setOldParentIds, setCurrentParentId }) }
                        }}
                    className="btn ctl-btn back-btn"
                    title="Go back to categories"
                >
                    ←
                </button>
                <button
                    onClick={() => console.log('click')}
                    className="btn ctl-btn search-btn"
                    title="Search symbols and categories"
                >
                    🔍
                </button>
                {showAdminScreen && <button
                    className="btn ctl-btn add-btn"
                    title="add TTS button"
                    onClick={() => {
                        setShowAdminScreen(false)
                        setShowAdminForm(true)
                    }}
                >
                    +
                </button>}
                {showAdminScreen && <button
                    className="btn ctl-btn toggle-view-btn"
                    title={showAllNodes ? "Show normal tree structure" : "Show all nodes"}
                    onClick={() => setShowAllNodes(!showAllNodes)}
                >
                    {showAllNodes ? "ShowTree" : "Show All"}
                </button>}
                {
                    addChild &&
                    <button
                        className="btn ctl-btn add-to-children"
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
                                setAddChild(false)
                            }
                        }}
                        className="btn ctl-btn admin-exit-btn"
                        title="Exit admin mode"
                    >
                        ⚙️
                    </button>
                ) : (
                    <button
                        onClick={() => console.log('click')}
                        className="btn ctl-btn admin-enter-btn"
                        title="Admin settings"
                    >
                        ⚙️
                    </button>
                )}
                <button
                    onClick={() => speak(ttsContent)}
                    className="btn ctl-btn speak-btn"
                    title="Speak text"
                >
                    🔊
                </button>
                <button
                    onClick={() => setTTsContent('')}
                    className="btn ctl-btn clear-btn"
                    title="Clear text"
                >
                    ✕
                </button>
            </div>
        </div >
    );
}

export default Controls;