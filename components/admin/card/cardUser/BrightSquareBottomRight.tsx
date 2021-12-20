import { Box } from "@mui/system";
import { sentenceToCamelCase } from "helpers/strings";

const BrightSquareBottomRight = ({subscriptionStatus, clicked}: {subscriptionStatus: SubscriptionStatus, clicked: boolean}) => {
    return (
      <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: [25, 30, 35],
        width: [25, 30, 35],
        borderBottomRightRadius: 5,
        transition: 'opacity 0.1s',
        backgroundColor: `custom.subscription.${sentenceToCamelCase(subscriptionStatus)}`,
        //if clicked
        opacity: clicked ? 0 : 1,

        '::after, ::before': {
          content: '""',
          position: 'inherit',
          bottom: 'inherit',
          right: 'inherit',
          height: 'inherit',
          width: 'inherit',
          borderTopRightRadius: 2,
          borderTopLeftRadius: 2,
          backgroundColor: 'inherit',
          opacity: 0.4,
          transform: 'translate(0, -100%)',
        },
        '::before': {
          transform: 'translate(-100%, 0)',
        },
      }}
    />

    );
}

export default BrightSquareBottomRight;