
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { TreatmentFormInput } from "@/schema/treatmentSchema";

interface AddTreatmentPayload extends TreatmentFormInput{
    chartNo: string;
}

export const useAddTreatment = (chartNo: string)=>{

    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async(newTreatment: AddTreatmentPayload)=>{
          const res = await axios.post('http://localhost:4000/api/treatment', newTreatment)
          return res.data;
      },
      onMutate: async(newTreatment)=>{
          await queryClient.cancelQueries({queryKey: ['treatments', chartNo]});
          
          const prevTreatments = queryClient.getQueryData(['treatments', chartNo]);
          
          queryClient.setQueryData(['treatments', chartNo],(oldData:any)=>{
            const optimisticItem={
              id: `temp-${Date.now()}`,
              treatmentName: newTreatment.treatmentName,
              totalCount: newTreatment.totalCount,
              remainingCount: newTreatment.totalCount,
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
            };
            return oldData ? [optimisticItem, ...oldData] : [optimisticItem]
          });
        return { prevTreatments } ;  //백업데이터 반환
      },
      onError: ( err, _, context)=>{
        if(context?.prevTreatments){  //롤백
          queryClient.setQueryData(['treatments', chartNo], context.prevTreatments)
        }
        console.error('시술권 추가 실패:', err);
      },
      onSettled: ()=>{
        queryClient.invalidateQueries({queryKey: ['treatments', chartNo]})
      }
    })
}