
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { TreatmentFormInput } from "@/schema/treatmentSchema";

interface AddTreatmentPayload extends TreatmentFormInput{
    chartNo: string;
}

export const useAddTreatment = (chartNo: string)=>{

    const queryClient = useQueryClient();
    const queryKey = ['patientReservation', chartNo];

    return useMutation({
      mutationFn: async(newTreatment: AddTreatmentPayload)=>{
          const res = await axios.post('http://localhost:4000/api/treatment', newTreatment)
          return res.data;
      },
      onMutate: async(newTreatment)=>{
          await queryClient.cancelQueries({queryKey});
          
          const prevData = queryClient.getQueryData(queryKey);
          
          queryClient.setQueryData(queryKey,(oldData:any)=>{
            
            if (!oldData) return oldData;

            const optimisticItem={
              id: `temp-${Date.now()}`,
              treatmentName: newTreatment.treatmentName,
              totalCount: newTreatment.totalCount,
              remainingCount: newTreatment.totalCount,
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
            };
            return {
              ...oldData, 
              treatments: [optimisticItem, ...oldData.treatments] ,
              }
          });
        return { prevData } ;  //백업데이터 반환
      },
      onError: ( err, _, context)=>{
        if(context?.prevData){  //롤백
          queryClient.setQueryData(queryKey, context.prevData)
        }
        console.error('시술권 추가 실패:', err);
      },
      onSettled: ()=>{
        queryClient.invalidateQueries({queryKey})
      }
    })
}