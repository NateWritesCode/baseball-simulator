const Test = () => {
	return (
		<div className="flex flex-row min-h-screen justify-center items-center">
			<iframe
				src="https://saferate.com/chat"
				style={{
					width: "400px",
					height: "800px",
				}}
				title="Safe Rate chat"
			/>
		</div>
	);
};

export default Test;
