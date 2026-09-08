const PageHead = ({ title }: { title: string }) => {
  return (
    <h1 className="pb-0.5 text-[21px] font-semibold tracking-[-0.02em]">
      {title}
    </h1>
  );
};

export default PageHead;
