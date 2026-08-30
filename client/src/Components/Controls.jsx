import { useRef } from 'react'
import '../styles/Controls.css'
import speak from '../Functions/speak';
import navUpLayer from '../Functions/NavUpLayer';
import validateImportPayload from '../Functions/validateImportPayload';
import * as apiCalls from '../Nodeapi';

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
    addParent,
    setAddParent,
    data,
    setData,
    isSelectLeaf,
    setIsSelectLeaf,
    relationTarget,
    setRelationTarget,
    oldData,
    setOldData,
    showAllNodes,
    setShowAllNodes,
    currentParentId,
    setCurrentParentId,
    oldParentIds,
    setOldParentIds,
    searchActive,
    onToggleSearch
}) {
    const importFileRef = useRef(null)

    async function handleExportData() {
        try {
            const dump = await apiCalls.exportData()
            const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'aac-export.json'
            document.body.appendChild(link)
            link.click()
            link.remove()
            URL.revokeObjectURL(url)
        } catch (err) {
            alert(`Failed to export data: ${err.message}`)
        }
    }

    async function handleImportFileChange(e) {
        const file = e.target.files[0]
        e.target.value = "" // allow re-selecting the same file later
        if (!file) return

        let parsed
        try {
            parsed = JSON.parse(await file.text())
        } catch (err) {
            alert('That file is not valid JSON.')
            return
        }

        const validationError = validateImportPayload(parsed)
        if (validationError) {
            alert(`That file doesn't look like a valid export: ${validationError}`)
            return
        }

        const nodeCount = (Array.isArray(parsed) ? parsed : parsed.nodes).length
        const confirmed = window.confirm(
            `This will REPLACE all data currently on this board with the ${nodeCount} node(s) from this file. This cannot be undone. Continue?`
        )
        if (!confirmed) return

        try {
            await apiCalls.importData(parsed)
            const allNodes = await apiCalls.fetchAllNodes()
            // reset the view back to Home with the freshly-imported data,
            // since anything cached from the old dataset (ids included)
            // may no longer exist
            setData(allNodes.filter((node) => node.topLevel))
            setOldData([])
            setOldParentIds([])
            setCurrentParentId(null)
            setIsSelectLeaf({})
            alert('Import complete.')
        } catch (err) {
            alert(`Failed to import data: ${err.message}`)
        }
    }

    return (
        // All buttons are direct flex children of one wrapping row (rather than
        // split into separate left/right containers) so that when the row runs
        // out of space, add-to-children/add-to-parents wrap down onto the same
        // bottom row as the admin/speak/clear buttons instead of getting a row
        // of their own. The admin button carries `margin-left: auto` (see
        // Controls.css) to keep it (and speak/clear after it) pinned to the
        // right edge whenever there's room, same as the old two-group layout.
        <div id="controls-container">
            <button
                style={showAdminScreen && oldData.length == 0 ? { backgroundColor: "lightgray" } : {}}
                onClick={
                    () => {
                        if (showAdminForm) {
                            setShowAdminForm(false);
                            setShowAdminScreen(true);
                            setIsSelectLeaf({})
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
                onClick={onToggleSearch}
                className={`btn ctl-btn search-btn${searchActive ? ' search-btn-active' : ''}`}
                title={searchActive ? "Stop search" : "Search symbols and categories"}
            >
                {searchActive ? '⏹' : '🔍'}
            </button>
            {showAdminScreen && <button
                className="btn ctl-btn add-btn"
                title="add TTS button"
                onClick={() => {
                    // mid add-child/add-parent selection: stash the node whose
                    // relations we're building and blank the form so "+" creates
                    // a brand-new node instead of re-opening the current one
                    if (addChild || addParent) {
                        setRelationTarget(isSelectLeaf)
                        setIsSelectLeaf({})
                    }
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
            {showAdminScreen && <button
                className="btn ctl-btn export-btn"
                title="Download all board data as a JSON file"
                onClick={handleExportData}
            >
                Export
            </button>}
            {showAdminScreen && <button
                className="btn ctl-btn import-btn"
                title="Replace all board data from a JSON file"
                onClick={() => importFileRef.current.click()}
            >
                Import
            </button>}
            <input
                ref={importFileRef}
                type="file"
                accept="application/json,.json"
                style={{ display: 'none' }}
                onChange={handleImportFileChange}
            />
            {
                addChild && !showAdminForm &&
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
            {
                addParent && !showAdminForm &&
                <button
                    className="btn ctl-btn add-to-parents"
                    onClick={() => {
                        setIsSelectLeaf({})
                        setShowAdminScreen(false)
                        setAddParent(false)
                    }
                    }

                >
                    <span>Add to Parents</span>
                </button>
            }
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
                            setAddParent(false)
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
    );
}

export default Controls;