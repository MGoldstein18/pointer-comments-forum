import * as wagmi from 'wagmi';
import type { BigNumber } from 'ethers';
import CommentsContract from '../artifacts/contracts/Comments.sol/Comments.json';

export interface Comment {
  id: string;
  topic: string;
  message: string;
  creator_address: string;
  created_at: BigNumber;
}

export enum EventType {
  CommentAdded = 'CommentAdded'
}

const useCommentsContract = () => {
  const [signer] = wagmi.useSigner();

  const provider = wagmi.useProvider();

  const contract = wagmi.useContract({
    addressOrName: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    contractInterface: CommentsContract.abi,
    signerOrProvider: signer.data || provider
  });

  const getComments = async (topic: string): Promise<Comment[]> => {
    return contract.getComments(topic).then((comments) => {
      console.log(comments);
      return comments.map((c) => ({ ...c }));
    });
  };

  const addComment = async (topic: string, message: string): Promise<void> => {
    const tx = await contract.addComment(topic, message);
    await tx.wait();
  };

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    getComments,
    addComment
  };
};

export default useCommentsContract;
