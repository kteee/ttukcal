const PageHead = ({ title }: { title: string }) => {
  return (
    <h1 className="pb-0.5 text-[19px] font-semibold tracking-[-0.02em] lg:text-[21px]">
      {title}
    </h1>
  );
};

export default PageHead;
