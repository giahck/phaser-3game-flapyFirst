package com.ThreeGame.ThreeGame.centralizze;

import com.ThreeGame.ThreeGame.centralizze.serviceRabit.ScoreService;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitConfig {

    @Bean
    public Queue scoreQueue() {
        return new Queue("scoreQueue", true); // Durable
    }

    @Bean
    public DirectExchange scoreExchange() {
        return new DirectExchange("scoreExchange"); // Direct exchange
    }

    @Bean
    public Binding binding(Queue scoreQueue, DirectExchange scoreExchange) {
        return BindingBuilder.bind(scoreQueue)
                .to(scoreExchange)
                .with("score.update"); // Routing key
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setReplyTimeout(5000); // Set reply timeout to 5 seconds
        return template;
    }


}