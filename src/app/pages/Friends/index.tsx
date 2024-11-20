import React, { useEffect, useState } from "react";

import LoadingIndicator from "@/app/components/LoadingIndicator";

import * as api from "@/app/api";

interface FriendsProps {
  windowHeight: number;
  windwoWidth: number;
  dynamicProps: any;
}

export default function Friends({ windowHeight, windwoWidth, dynamicProps }: FriendsProps) {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.getFriends(dynamicProps.name);
        setFriends(response.data.friends);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFriends();
  }, []);

  if (isLoading) {
    return(
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <LoadingIndicator />
      </div>
    )
  }

  return(
    <div>
      <h1>Friends</h1>
    </div>
  )
}
