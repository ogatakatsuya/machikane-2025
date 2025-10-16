const LoadingPage = ({ text }: { text: string }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
};

export default LoadingPage;
