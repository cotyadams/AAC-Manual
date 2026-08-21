import { useState } from 'react'

export default function AuthenticationForm({ showAdminForm, setShowAdminForm, setShowPassForm, showPassForm }) {

    const [password, setPassword] = useState('')

    return (
        <div>
            <form onSubmit={() => {
                if (password === '123') {
                    console.log(password)
                    authenticate(setShowAdminForm, setShowPassForm)
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

function authenticate(setShowAdminForm, setShowPassForm) {
    event.preventDefault();
    setShowPassForm(false)
    setShowAdminForm(true)
}