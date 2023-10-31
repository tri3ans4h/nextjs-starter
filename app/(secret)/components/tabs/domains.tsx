import React from 'react';
import MaxWidthWrapper from './max-width-wrapper';



const Domains = () => {
  const numberOfDivs = 3;

  const divElements = [];
  for (let i = 0; i < numberOfDivs; i++) {
    divElements.push(
      <div
        key={i}
        className="h-20 w-full  rounded-lg  border  mt-8"
      ></div>,
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-xl md:text-4xl  px-6 md:px-6">Domains</span>
      <MaxWidthWrapper> 

      </MaxWidthWrapper>

      <div className="border-t  mt-10">
        <MaxWidthWrapper>{divElements}</MaxWidthWrapper>
      </div>
    </div>
  );
};

export default Domains;