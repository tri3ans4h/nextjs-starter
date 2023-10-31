
export default function Simple({ params }: { params: { key: string } }) {
  
    return (
        <>
            <div className="flex-1 flex flex-col ">
                <div className="mb-6 bg-white">
                    <div className="flex flex-col my-6 items-center text-center" >
                        <img src="https://source.unsplash.com/75x75/?portrait" alt="" className="self-center flex-shrink-0 w-16 h-16 border rounded-full md:justify-self-start " />
                        <h3 className=" text-2xl py-1">Selamat Datang Apri Triansah</h3>
                        <p>{params.key}</p>
                    </div>
                </div>
            </div>
        </>
    );

}
