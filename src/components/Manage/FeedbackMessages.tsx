"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/Card";

interface FeedbackMessagesProps {
  success?: boolean;
  errorMsg: string | null;
}

export function FeedbackMessages({ success, errorMsg }: FeedbackMessagesProps) {
  return (
    <>
      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 fixed top-0"
        >
          <Card className="p-4 bg-green-50 border border-green-200">
            <p className="text-green-700 font-semibold text-center">
              ✅ Dados salvos com sucesso!
            </p>
          </Card>
        </motion.div>
      )}

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 fixed top-0"
        >
          <div className="fixed top-5 w-full flex justify-center items-center">
            <Card className="p-4 bg-red-50 border border-red-200">
              <p className="text-red-700 font-semibold text-center">
                {errorMsg}
              </p>
            </Card>
          </div>
        </motion.div>
      )}
    </>
  );
}