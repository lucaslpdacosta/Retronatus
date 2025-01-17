import { Box, Divider, FlatList } from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";

import {
  CommentForm,
  CommentItemWithReplies,
  NewsfeedCard,
} from "../../components";
import { SingleViewPostScreenProps } from "./types";
import {
  IComentario,
  IPublicacao,
  useComentarios,
  usePublicacoes,
  useUsuario,
} from "../../hooks";

const SingleViewPostScreen = ({
  navigation,
  route,
}: SingleViewPostScreenProps) => {
  const { getSinglePublicacao } = usePublicacoes();
  const { comentarios } = useComentarios(route.params.feedId);
  const [feedItem, setFeedItem] = useState<IPublicacao>();

  const loadPubli = useCallback(async () => {
    const getPubli = await getSinglePublicacao(route.params.feedId);
    setFeedItem(getPubli);
  }, [route.params.feedId]);

  useEffect(() => {
    loadPubli();
  }, []);

  const commentInputRef = useRef<TextInput>(null);

  const [isCommentInputVisible, setIsCommentInputVisible] =
    useState<boolean>(false);

  const renderItem = ({ item }: { item: IComentario }) => (
    <CommentItemWithReplies data={item} bgColor="white" px="4" />
  );

  const keyExtractor = useCallback(
    (item: IComentario) =>
      item.idComentario?.toString() ?? Math.random().toString(),
    []
  );

  const ListHeaderComponent = () =>
    !route.params.feedId ? null : (
      <>
        <NewsfeedCard
          isSingleView
          onPublicacaoDeleted={loadPubli}
          data={feedItem}
          bgColor="white"
          px="4"
          pt="4"
          pb={isCommentInputVisible ? null : "4"}
          commentInputRef={commentInputRef}
          onPressComment={() => {
            setIsCommentInputVisible(true);
          }}
        />
        {isCommentInputVisible ? (
          <Box bgColor="white" p="4">
            <Divider mb="4" />
            <CommentForm
              feedId={route.params.feedId}
              commentInputRef={commentInputRef}
            />
            <Divider mt="4" />
          </Box>
        ) : null}
      </>
    );

  const ItemSeparatorComponent = useCallback(
    () => (
      <Box bgColor="white" p="4">
        <Divider />
      </Box>
    ),
    []
  );

  return (
    <Box testID="single-view-post" flex={1} safeAreaX>
      <FlatList
        flex={1}
        data={comentarios}
        ListHeaderComponent={ListHeaderComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </Box>
  );
};

export default SingleViewPostScreen;
