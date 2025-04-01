# 构建阶段
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# 复制 pom.xml 和源代码
COPY pom.xml .
COPY src ./src

# 构建应用
RUN mvn clean package -DskipTests

# 运行阶段
FROM openjdk:17-jdk-slim
WORKDIR /app

# 复制构建产物
COPY --from=build /app/target/*.jar app.jar

# 设置环境变量
ENV SPRING_PROFILES_ACTIVE=prod
ENV DB_URL=jdbc:mysql://database-1.c9ios0g8snh0.us-west-2.rds.amazonaws.com:3306/UW_Social?useSSL=true&serverTimezone=UTC
ENV DB_USERNAME=GGBond114514
ENV DB_PASSWORD=Wuxiuyuan2006
ENV JWT_SECRET=your-jwt-secret-key
ENV CORS_ALLOWED_ORIGINS=https://alanvanderboom.com

# 暴露端口
EXPOSE 8080

# 启动命令
ENTRYPOINT ["java", "-jar", "app.jar"] 