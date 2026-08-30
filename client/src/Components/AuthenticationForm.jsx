import { useState } from 'react'

export default function AuthenticationForm({ showAdminScreen, setShowAdminScreen, setShowPassForm, showPassForm }) {

    const [password, setPassword] = useState('')

    return (
        <div>
            <form onSubmit={(event) => {
                if (password === '123') {
                    console.log(password)
                    authenticate(setShowAdminScreen, setShowPassForm, event)
                }
            }}
            >
                <input
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                    autoFocus
                />
            </form>
        </div >
    )
}

async function authenticate(setShowAdminScreen, setShowPassForm, event) {
    event.preventDefault();
    setShowPassForm(false);
    setShowAdminScreen(true);
}