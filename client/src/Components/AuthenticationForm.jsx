import { useState } from 'react'

export default function AuthenticationForm({ showAdminScreen, setShowAdminScreen, setShowPassForm, showPassForm }) {

    const [password, setPassword] = useState('')

    return (
        <div>
            <form onSubmit={() => {
                if (password === '123') {
                    console.log(password)
                    authenticate(setShowAdminScreen, setShowPassForm)
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

function authenticate(setShowAdminScreen, setShowPassForm) {
    event.preventDefault();
    setShowPassForm(false)
    setShowAdminScreen(true)
}