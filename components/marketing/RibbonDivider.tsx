type RibbonDividerProps = {
  className?: string;
};

const RibbonDivider = ({ className = "" }: RibbonDividerProps) => {
  return (
    <div className={`flex w-full justify-center mt-12 mb-14 sm:mt-16 sm:mb-20 ${className}`}>
      <img
        src="assets/images/divider-ribbon-horizontal.png"
        alt=""
        aria-hidden="true"
        className="block h-auto w-[220px] object-contain opacity-90 sm:w-[260px] md:w-[300px]"
      />
    </div>
  );
};

export default RibbonDivider;
