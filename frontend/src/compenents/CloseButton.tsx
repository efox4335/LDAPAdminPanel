const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button type='button' onClick={onClick} className='closeButton'>X</button>
  );
};

export default CloseButton;
