import { useMutation } from "react-query";
import { client } from "./api-client";

export const useScheduleTweet = () => {
  return useMutation((data) => client("/api/tweet", { data }));
};
