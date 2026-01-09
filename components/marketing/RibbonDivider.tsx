import dividerRibbon from "../../assets/images/divider-ribbon-horizontal.png";

type RibbonDividerProps = {
  className?: string;
};

const RibbonDivider = ({ className = "" }: RibbonDividerProps) => {
  return (
    <div className={`ribbon-motion flex w-full justify-center ${className}`.trim()}>
      <div className="w-full max-w-[920px] px-2 sm:px-6">
        <img
          src={dividerRibbon.src}
          alt=""
          aria-hidden="true"
          className="mx-auto block h-auto w-[92%] max-w-[640px] object-contain sm:w-[720px] sm:max-w-none lg:w-[860px]"
        />
      </div>
    </div>
  );
};

export default RibbonDivider;
