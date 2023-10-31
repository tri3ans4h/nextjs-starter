import React from 'react';
import MaxWidthWrapper from './max-width-wrapper';


const Integrations = () => {
  return (
    <div className="flex flex-col h-screen">

      <span className="text-xl md:text-4xl  px-6 md:px-6">Integrations</span>
      <div className="border-t  mt-10">
        <div className="border-r w-[300px] h-screen hidden md:flex"></div>
      </div>
      {/*  <MaxWidthWrapper>
        <span className="text-4xl mx-auto px-4">Integrations</span>
      </MaxWidthWrapper>

      <div className="px-4 w-full border-t mt-10 flex">
        <MaxWidthWrapper>
          <div className="  mt-8 border border-zinc-800 rounded-lg h-[800px]"></div>
        </MaxWidthWrapper>
      </div>
  */}
    </div>
  );
};

export default Integrations;