export default {
  sleep: {
    fellAsleep: (time) => {
      const hour = time.hour();
      const isEvening = hour > 19 || (hour === 19 && time.minute() >= 30) || hour < 5;

      const wakeTime = isEvening
        ? time.hour(8).minute(0).second(0).millisecond(0)
        : time.add(1.5, "hour");

      return {
        text: `🌚 Давид заснув о ${time.format("HH:mm")}.\nЙому прокидатись о ${wakeTime.format("HH:mm")}`,
        delayed: isEvening
          ? null
          : {
              text: "Давиду час прокидатись!",
              delay: 5400000,
            },
      };
    },
    wokeUp: (time) => ({
      text: `🌞 Давид прокинувся в ${time.format("HH:mm")}\nЙому лягати спати в +-${time.add(3, "hour").format("HH:mm")}`,
      delayed: {
        text: "Давиду час лягати спати!",
        delay: 10800000,
      },
    }),
  },
  location: {
    arrived: (name, place, time) => {
      const verb = name === "Бодя" ? "приїхав" : "приїхала";
      return {
        text: `${name} ${verb} ${place} в ${time.format("HH:mm")}`,
      };
    },
    left: (name, place, time) => {
      const verb = name === "Бодя" ? "поїхав" : "поїхала";
      return {
        text: `${name} ${verb} ${place} в ${time.format("HH:mm")}`,
      };
    },
  },
  outdoor: (time) => ({
    text: `🚶‍♂️ Давид вийшов на прогулянку в ${time.format("HH:mm")}`,
    delayed: {
      text: "Давид погуляв годину, можна іти додому!",
      delay: 3600000,
    },
  }),
  callMePlease: (name) => ({
    text: `${name}, подзвони мені через 5 хвилин!`,
    delayed: {
      text: `${name}, подзвони мені от прям зараз!`,
      delay: 300000,
    },
  }),
};
