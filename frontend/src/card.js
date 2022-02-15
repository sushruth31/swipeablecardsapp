import { useState } from "react";
import TinderCard from "react-tinder-card";
import { ListItemText } from "@mui/material";
import { Box, height } from "@mui/system";
import moment from "moment";
import useSwipes from "./useSwipes";
import { AnimatePresence, motion } from "framer-motion";

export default function ({ patient_name, arrhythmias, created_date, todoOrDone, id }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [onSwipeLeft, onSwipeRight] = useSwipes({ patient_name, arrhythmias, created_date, id });

  function PatientDetails() {
    return (
      <>
        <AnimatePresence>
          <motion.div
            key={id}
            initial={{ width: 0 }}
            animate={{ width: 300 }}
            exit={{ width: 0 }}
            className=" mt-4 flex h-64 w-[100%] flex-col p-2">
            <div>{`Created Date: ${moment(new Date(created_date)).fromNow()}`}</div>
            <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
              <div className="mb-2 font-bold">Arrhythmias:</div>
              {arrhythmias.map((el, i) => (
                <motion.li
                  initial={"hidden"}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: -50,
                    },
                    visible: i => ({
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: i * 0.05,
                      },
                    }),
                  }}
                  animate="visible"
                  custom={i}
                  className="list-none"
                  key={el}
                  component="a"
                  href="#simple-list">
                  <ListItemText primary={el} />
                </motion.li>
              ))}
            </Box>
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  return (
    <AnimatePresence>
      <TinderCard
        className="absolute mb-[50px] flex h-80 w-80 items-center justify-center rounded-xl bg-white"
        onSwipe={todoOrDone === "todo" ? onSwipeRight : onSwipeLeft}>
        <motion.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div onClick={() => setIsFlipped(p => !p)} className="absolute right-2 top-2 cursor-pointer">
            {!isFlipped ? "View Details" : "Hide Details"}
          </div>
          {!isFlipped ? (
            <motion.div
              key={id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="">{`Patient Name: ${patient_name}`}</motion.div>
          ) : (
            <PatientDetails />
          )}
        </motion.div>
      </TinderCard>
    </AnimatePresence>
  );
}
