"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Create_1 = require("../../services/RecipesTable/Create");
const event = {
    // queryStringParameters: {
    //     recipeId: '9ebab7db-0d37-4622-b83b-c209b203ba17'
    // }
    body: {
        name: 'Burrito',
        cuisine: 'Mexican'
    }
};
// Event and context
const result = (0, Create_1.handler)(event, {}).then((apiResult) => {
    const items = JSON.parse(apiResult.body);
    console.log(123);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVsbG8udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkhlbGxvLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrREFBNkQ7QUFFN0QsTUFBTSxLQUFLLEdBQXlCO0lBQ2hDLDJCQUEyQjtJQUMzQix1REFBdUQ7SUFDdkQsSUFBSTtJQUNKLElBQUksRUFBRTtRQUNGLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLFNBQVM7S0FDckI7Q0FDRyxDQUFDO0FBR1Qsb0JBQW9CO0FBQ3BCLE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU8sRUFBQyxLQUFLLEVBQUUsRUFBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7SUFDeEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNwQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQSUdhdGV3YXlQcm94eUV2ZW50IH0gZnJvbSAnYXdzLWxhbWJkYSc7XHJcbmltcG9ydCB7IGhhbmRsZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9SZWNpcGVzVGFibGUvQ3JlYXRlJztcclxuXHJcbmNvbnN0IGV2ZW50OiBBUElHYXRld2F5UHJveHlFdmVudCA9IHtcclxuICAgIC8vIHF1ZXJ5U3RyaW5nUGFyYW1ldGVyczoge1xyXG4gICAgLy8gICAgIHJlY2lwZUlkOiAnOWViYWI3ZGItMGQzNy00NjIyLWI4M2ItYzIwOWIyMDNiYTE3J1xyXG4gICAgLy8gfVxyXG4gICAgYm9keToge1xyXG4gICAgICAgIG5hbWU6ICdCdXJyaXRvJyxcclxuICAgICAgICBjdWlzaW5lOiAnTWV4aWNhbidcclxuICAgIH1cclxufSBhcyBhbnk7XHJcblxyXG5cclxuLy8gRXZlbnQgYW5kIGNvbnRleHRcclxuY29uc3QgcmVzdWx0ID0gaGFuZGxlcihldmVudCwge30gYXMgYW55KS50aGVuKChhcGlSZXN1bHQpID0+IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gSlNPTi5wYXJzZShhcGlSZXN1bHQuYm9keSk7XHJcbiAgICBjb25zb2xlLmxvZygxMjMpXHJcbn0pOyJdfQ==