import { motion } from "framer-motion";

export const cx = (...c) => c.filter(Boolean).join(" ");

// Returns a framer-motion element when `variants` is passed, else a plain tag.
// e.g. <Heading as="h1" variants={item}> renders <motion.h1 variants={item}>.
export function getTag(as, variants) {
  return variants ? motion[as] ?? motion.div : as;
}