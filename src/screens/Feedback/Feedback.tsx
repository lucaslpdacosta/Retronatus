import React, { useLayoutEffect } from "react";
import { FeedbackScreenProps, LocalType } from "./types";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  Toast,
} from "native-base";
import { useFormik } from "formik";
import { useFeedbacks } from "../../hooks";

const Feedback = ({ navigation }: FeedbackScreenProps) => {
  const { createFeedback } = useFeedbacks();
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    isSubmitting,
  } = useFormik<LocalType>({
    initialValues: { name: "", address: "" },
    onSubmit: async () => {
      await onSubmit(values);
    },
  });

  const onSubmit = async (props: LocalType) => {
    try {
      await createFeedback(props);
      navigation.goBack();
    } catch (error) {
      Toast.show({
        title: "Erro ao criar local",
        description: JSON.stringify(error),
      });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          mt="1"
          pr="4"
          testID="btn-save"
          borderRadius="0"
          variant="unstyled"
          size="full"
          justifyContent="flex-end"
          alignItems="center"
          height="8"
          _text={{ color: "black", fontSize: 18, fontWeight: 700 }}
          _pressed={{ backgroundColor: "rgba(0,0,0,0)" }}
          onPress={() => handleSubmit()}
          isDisabled={!values.address || !values.name}
          isLoading={isSubmitting}
        >
          Confirmar
        </Button>
      ),
    });
  }, [navigation, isSubmitting, handleSubmit, onSubmit]);

  return (
    <KeyboardAvoidingView flex={1}>
      <Box h={1} w="full" bgColor="white" />
      <ScrollView flex={1} bg="white" _contentContainerStyle={{ flexGrow: 1 }}>
        <Box px={4} py={6}>
          <FormControl
            isRequired
            isDisabled={isSubmitting}
            isInvalid={!isValid}
          >
            <FormControl.Label>
              Informe o nome do local que deseja solicitar:
            </FormControl.Label>
            <Input
              value={values.name}
              onChangeText={handleChange("name")}
              placeholder="Ex.: Du Rei Casa Show"
              fontSize="16px"
              flex={1}
              p={4}
              bg="#fff"
              onBlur={handleBlur("name")}
              textAlignVertical="top"
            />
          </FormControl>
        </Box>

        <Divider />
        <Box px={4} py={6}>
          <FormControl
            isDisabled={isSubmitting}
            isInvalid={!isValid}
            isRequired
          >
            <FormControl.Label>
              Informe o endereço do local que deseja solicitar:
            </FormControl.Label>
            <Input
              value={values.address}
              onChangeText={handleChange("address")}
              placeholder="Ex.: Avenida Getúlio vargas, 2222"
              fontSize="16px"
              p={4}
              flex={1}
              bg="#fff"
              onBlur={handleBlur("address")}
              textAlignVertical="top"
            />
          </FormControl>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Feedback;
