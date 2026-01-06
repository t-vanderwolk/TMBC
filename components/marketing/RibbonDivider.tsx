import dividerRibbon from "../../assets/images/divider-ribbon-horizontal.png";

type RibbonDividerProps = {
  className?: string;
};

const RibbonDivider = ({ className = "" }: RibbonDividerProps) => {
  return (
    <div className={`my-12 flex w-full justify-center sm:my-16 lg:my-24 ${className}`}>
      <div className="w-full max-w-[920px] px-4 sm:px-6">
        <img
          src={dividerRibbon.src}
          alt=""
          aria-hidden="true"
          className="mx-auto block h-auto w-[86%] max-w-[520px] object-contain sm:w-[640px] sm:max-w-none lg:w-[820px]"
        />
      </div>
    </div>
  );
};

export default RibbonDivider;
