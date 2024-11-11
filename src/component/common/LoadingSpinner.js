const LoadingSpinner = ({ fullScreen = false }) => (
    <div className={`${fullScreen ? 'fixed inset-0' : 'w-full h-full'} flex items-center justify-center bg-white/80 min-h-[200px]`}>
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <span className="text-lg font-medium text-gray-700">로딩중...</span>
        </div>
    </div>
);

export default LoadingSpinner;