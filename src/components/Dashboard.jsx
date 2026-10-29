import { useState } from "react";

function Dashboard() {
    const [search, setSearch] = useState("");

    return (
        <div className="min-h-screen bg-gray-950 text-white md:flex">
            
            {/* sidebar */}
            <aside className="w-full border-b border-gray-800 p-5 md:min-h-screen md:border-b-0 md:border-r">
                <h1 className="text-2xl font-bold text-blue-400">VaultBox</h1>

                <nav className="mt-8 space-y-2">
                    <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-left font-medium">My Files</button>
                    <button className="w-full rounded-lg px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-gray-800">Folders</button>
                </nav>

                <button className="mt-8 w-full rounded-lg border border-gray-700 px-4 py-3 text-gray-300 hover:bg-gray-800" onClick={ () => {localStorage.removeItem('token'); window.location.href = './login';}}>Log out</button>
            </aside>

            {/* main content */}
            <main className="min-w-0 flex-1 p-5 md:p-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">My Files</h2>
                        <p className="mt-1 text-sm text-gray-400">Manage your Files in one place.</p>
                    </div>
                </header>

                {/* search  */}
                <div>
                    <input type="search" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 outline-none focus:border-blue-500" placeholder="Search your files..." value={search} onChange={(e)=> setSearch(e.target.value)} />
                </div>

                {/* File list placeholder  */}
                <section className="mt-8 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                    <div className="border-b border-gray-800 px-5 py-4">
                        <h3 className="font-medium">Recent files</h3>
                    </div>

                    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                        <div className="text-4xl">📁</div>

                        <h3 className="flex flex-col items-center justify-center px-5 py-16 text-center">
                            No files yet
                        </h3>

                        <p className="mt-2 text-sm text-gray-400">Upload your first file to get started.</p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;