import { useEffect, useState } from "react";

function Dashboard() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [files, setFiles] = useState('');
    
    const fetchFiles = async () => {
        try{
            const token = localStorage.getItem('token');

            const URL = 'http://localhost:3000/api/files';

            const response = await fetch(URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Failed to load files');
            }
            setFiles(data.files);
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=> {
        fetchFiles();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white md:flex">
            
            {/* sidebar */}
            <aside className="w-64 shrink-0 border-r border-gray-800 p-5 min-h-screen md:border-b-0 md:border-r">
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

                    { loading ? (
                        <p className="p-6 text-gray-400"> Loading files... </p>
                    ): error ? (
                        <p className="p-6 text-red-400">{error}</p>
                    ): files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                            <div className="text-4xl">📁</div>

                            <h3 className="mt-4 font-medium"> No files yet </h3>

                            <p className="mt-2 text-sm text-gray-400">Upload your first file to get started.</p>
                        </div>
                        
                    ): (
                        <div className="divide-y divide-gray-800">
                            {files
                                .filter((file)=>
                                file.filename.toLowerCase().includes(search.toLowerCase())
                            ).map((file)=>(
                                <div key={file.id} className="flex items-center justify-between gap-4 p-4">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">{file.filename}</p>
                                        <p className="text-sm text-gray-400">{(file.size/1024).toFixed(1)}KB</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                </section>
            </main>
        </div>
    );
}

export default Dashboard;