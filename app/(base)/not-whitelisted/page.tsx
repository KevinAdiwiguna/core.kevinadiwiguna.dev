export default function NotWhitelistedPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
			<p className="mt-2 text-gray-600">Email Anda tidak terdaftar dalam whitelist sistem.</p>
			<a href="/login" className="mt-4 text-blue-500 underline">
				Kembali ke Login
			</a>
		</div>
	);
}
